const escapeRegExp = text =>
    new RegExp(text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g")

module.exports = (item, currentSeperator) => {
    const desiredSeperator = '/'

    return (currentSeperator !== desiredSeperator)
        ? item.replace(
            escapeRegExp(currentSeperator), 
            desiredSeperator)
        : item;
}
