module.exports = {
    getYMD() {
        const [m, d, y] = new Date().toLocaleDateString().split('/')
        return `${y}年${m}月${d}日`
    },
}