@external('imports', 'jsFunction')
declare function jsFunction(result: i32): void

jsFunction(1234)

export function add(x: i32, y: i32): i32 {
  return x + y
}

export function factorial (n: f64): f64 {
  if (n === 0) return 1
  else return n * factorial(n - 1)
}
