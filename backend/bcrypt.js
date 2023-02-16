// importera bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// hashning av lösenord mot bcrypt
async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
}

// jämföra användarens inskrivna lösenord mot det som är i databasen (som vi redan matchat mer anv.namn)
async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Is a match: ', isMatch);
    return isMatch;
}

module.exports = {hashPassword, comparePassword};