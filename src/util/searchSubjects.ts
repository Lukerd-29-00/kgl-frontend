export default function searchSubjects(subjects: string[], pattern: RegExp): string[]{

    let newSubjects = [...subjects].filter((value) => {
        return value.match(pattern) !== null
    })
    newSubjects = newSubjects.sort((a: string, b: string) => {
        const [m1, m2] = [a.match(pattern), b.match(pattern)]
        if(m1 !== null && m2 === null){
            return -1
        }else if(m2 !== null && m1 === null){
            return 1
        }else{
            return ((m1 as RegExpMatchArray).index as number) - ((m2 as RegExpMatchArray).index as number)
        }
    })
    return newSubjects
}