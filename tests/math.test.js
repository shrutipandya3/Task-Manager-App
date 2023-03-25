const { calculateTip, add } = require('../src/math')

test('Should calculate total with tip', () => {
    const total = calculateTip(10, 0.3)

    expect(total).toBe(13)
})

test('Should calculate total with default tip', () => {
    const total = calculateTip(10)

    expect(total).toBe(12)
})

// test('Async func demo', (done) => {
//     setTimeout(() => {
//         expect(2).toBe(1)
//         done()
//     }, 2000)
// })

// test('should add two numbers', (done) => {
//     add(2,3).then((sum)=>{
//         expect(sum).toBe(5)
//         done()
//     })
// })

// test('should add two numbers async/await', async () => {
//     const sum = await add(2,3)
//     expect(sum).toBe(5) 
// })