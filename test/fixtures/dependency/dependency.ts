import dependent from './dependent'

export function test (v: i32): i32 {
  return dependent(v)
}
