export default function searchSubjects(subjects: string[], pattern: RegExp): string[]{

    let newSubjects = [...subjects].filter((value) => {
        return value.match(pattern) !== null
    })
    let patternStr = pattern.toString()
    patternStr = patternStr.slice(1,patternStr.length)
    const newPattern = new RegExp("^" + patternStr)
    newSubjects = newSubjects.sort((a: string, b: string) => {
        const [m1, m2] = [a.match(newPattern), b.match(newPattern)]
        if(m1 !== null && m2 === null){
            return -1
        }else if(m2 !== null && m1 === null){
            return 1
        }else{
            return 0
        }
    })
    return newSubjects
}