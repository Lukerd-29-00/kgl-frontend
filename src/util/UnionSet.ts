
export default class UnionSet<T> extends Set<T>{
    union(other: Set<T>){
        for(const obj of other){
            this.add(obj)
        }
    }
}