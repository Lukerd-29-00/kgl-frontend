import { render, screen, waitFor } from "@testing-library/react"
import Filters from "../../components/Filters"
import UnionSet from "../../util/UnionSet"

function setCmp<T>(A: Set<T>, B: Set<T>): boolean{
    for(const element of A){
        if(!(B.has(element))){
            return false
        }
    }
    for(const element of B){
        if(!(A.has(element))){
            return false
        }
    }
    return true
}

describe(Filters,() => {
    const filters = new Map<string,Set<string>>()
    const testContent = "http://www.ontologyrepository.com/CommonCoreOntologies/testContent"
    const test1 = new Set<string>([testContent])
    const test2 = new Set<string>([`${testContent}2`])
    const test3 = new Set<string>([`${testContent}3`,`${testContent}4`])
    const test4 = new Set<string>([testContent,`${testContent}2`])
    filters.set("test",test1)
    filters.set("test2",test2)
    filters.set("test3",test3)
    filters.set("test4",test4)
    const fetchCallbackMock = jest.fn<void,[Set<string>]>()
    beforeEach(() => {
        fetchCallbackMock.mockClear()
        render(<Filters fetchCallback={fetchCallbackMock} filters={filters}/>)
    })
    it("Should call the fetchCallback if a filter is selected", async () => {
        screen.getByText("test").click()
        //It's called from useEffect, so we need to use waitFor.
        await waitFor(() => {
            expect(fetchCallbackMock).toHaveBeenCalled()
        })
        expect(setCmp(fetchCallbackMock.mock.calls[1][0],test1)).toBe(true)
    })
    it("Should call the fetchCallback if a filter is deselected", async () => {
        screen.getByText("test2").click()
        screen.getByText("test").click()
        screen.getByText("test").click()

        await waitFor(() => {
            expect(fetchCallbackMock).toHaveBeenCalledTimes(4)
        })
        expect(setCmp(fetchCallbackMock.mock.calls[3][0],test2)).toBe(true)
    })
    it("Should select the union of the sets from the selected filters", async () => {
        screen.getByText("test").click()
        screen.getByText("test2").click()
        screen.getByText("test3").click()
        screen.getByText("test4").click()

        await waitFor(() => {
            expect(fetchCallbackMock).toHaveBeenCalledTimes(4)
        })
        const expected = new UnionSet<string>()
        expected.union(test1)
        expected.union(test2)
        expected.union(test3)
        expected.union(test4)
        expect(setCmp(fetchCallbackMock.mock.calls[3][0],expected)).toBe(true)
    })
})