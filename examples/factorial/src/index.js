import Asm from './assembly/asm.ts'

async function start() {
  const memory = new WebAssembly.Memory({ initial: 256 })
  const importObject = {
    env: {
      abort: () => {},
      memory
    },
    imports: { jsFunction }
  }

  const asm = await Asm(importObject)
  const { add, factorial } = asm

  document.body.innerHTML += '<br/>Add: ' + add(1, 2)
  document.body.innerHTML += '<br/>Factorial: ' + factorial(10)

  function jsFunction(result) {
    document.body.innerHTML += 'Feedback: ' + result
  }
}

start()
