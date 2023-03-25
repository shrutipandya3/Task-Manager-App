const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0){
                return reject('Numbers must be non-negative')
            }

            resolve(a + b)
        }, 2000)
    })
}

const calculateTip = (total, tipPercent = .2) => {
    const tip = total * tipPercent 
    return tip + total
}

module.exports = {
    calculateTip,
    add
}