import { Combobox } from '@headlessui/react'
import { useEffect, useState } from 'react'

let people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook']

// Repro: the value is changed from outside while the Combobox input is not focused. The input
// should keep its current focus state (the focus stays on the button). Before the fix, the caret
// syncing logic ran for the *unfocused* input and `setSelectionRange` could pull focus into it.
export default function Home() {
  let [person, setPerson] = useState(people[0])

  let [setSelectionRangeCalls, setSetSelectionRangeCalls] = useState(0)

  // Monkey-patch `setSelectionRange` so every call is logged and counted. Also force the caret of
  // the Combobox input to report position 0: browsers usually move the caret to the end when the
  // value is set programmatically, which makes the caret syncing logic bail out before it reaches
  // `setSelectionRange` (same trick as in the unit test).
  useEffect(() => {
    let input = document.getElementById('combobox-input')
    if (input) {
      Object.defineProperty(input, 'selectionStart', { configurable: true, get: () => 0 })
      Object.defineProperty(input, 'selectionEnd', { configurable: true, get: () => 0 })
    }

    let original = HTMLInputElement.prototype.setSelectionRange
    HTMLInputElement.prototype.setSelectionRange = function (this: HTMLInputElement, ...args) {
      let focused = document.activeElement === this
      console.log('[setSelectionRange]', { id: this.id, args, focused })
      setSetSelectionRangeCalls((n) => n + 1)
      return original.apply(this, args)
    }
    return () => {
      HTMLInputElement.prototype.setSelectionRange = original
    }
  }, [])

  return (
    <div className="flex h-full w-screen items-start justify-center bg-gray-50 p-12">
      <div className="flex w-full max-w-xs flex-col gap-4">
        <Combobox value={person} onChange={(value) => setPerson(value ?? people[0])}>
          <Combobox.Input
            id="combobox-input"
            className="w-full rounded border border-gray-300 px-3 py-2"
            onChange={() => {}}
          />
          <Combobox.Options className="rounded border border-gray-300 bg-white">
            {people.map((p) => (
              <Combobox.Option key={p} value={p} className="px-3 py-2 ui-active:bg-blue-100">
                {p}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>

        <button
          id="change-value"
          className="rounded bg-gray-800 px-3 py-2 text-white"
          onClick={() => {
            const nextIndex = (people.indexOf(person) + 1) % people.length
            setPerson(people[nextIndex])
          }}
        >
          Change value from outside
        </button>

        <p className="text-sm">
          <code>setSelectionRange</code> calls: <code>{setSelectionRangeCalls}</code> (also logged to
          the console)
        </p>
      </div>
    </div>
  )
}
