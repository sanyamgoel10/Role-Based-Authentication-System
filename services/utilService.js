class UtilService{
    checkValidObject(inpVal){
        return 'object' == typeof inpVal && inpVal != null && !Array.isArray(inpVal);
    }

    checkValidString(inpVal){
        return 'string' == typeof inpVal && inpVal.trim() != '';
    }

    checkValidEmail(inpVal){
        return this.checkValidString(inpVal) && (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(inpVal);
    }

    checkValidArray(inpVal){
        return 'object' == typeof inpVal && inpVal != null && Array.isArray(inpVal);
    }

    checkValidNumber(inpVal){
        return 'undefined' != typeof inpVal && inpVal != null && (/^\d+$/).test(inpVal);
    }
}

module.exports = new UtilService();