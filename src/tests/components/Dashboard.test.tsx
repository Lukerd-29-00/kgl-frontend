import { render, waitFor, queryByText, getByTestId, findByText, findByTestId, screen } from "@testing-library/react"
import Dashboard from "../../components/Dashboard"
import config from "../defaultConfig.json"

async function expectSubjects(...subjects: string[]): Promise<void>{
    screen.getByTestId("search-bar").click()
    await screen.findByText(subjects[0])
    for(let i = 1;i < subjects.length;i++){
        expect(screen.getByText(subjects[i])).toBeInTheDocument()
    }
}

function isFunc(object: string[] | (() => string[] | Promise<string[]>)): object is () => string[] | Promise<string[]>{
    return (object as () => string[] | Promise<string[]>).call !== undefined
} 

function setResolveValues(mockFetch: jest.SpyInstance | jest.Mock, ...jsons: Array<(() => string[] | Promise<string[]>) | string[]>): void{
    for(const json of jsons){
        if(isFunc(json)){
            mockFetch.mockResolvedValueOnce({
                json
            })
        }else{
            mockFetch.mockResolvedValueOnce({
                json: () => json
            })
        }
    }
}

describe(Dashboard,() => {
    const filters = new Map<string,Set<string>>()
    const testContent = "http://www.ontologyrepository.com/CommonCoreOntologies/testContent"
    const prefixes = new Map<string,string>(Object.entries(config.prefixes))
    filters.set("test",new Set([testContent]))
    filters.set("test2",new Set([`${testContent}2`]))
    const saveFetch = global.fetch
    const mockFetch = jest.spyOn(global,"fetch")
    it("Should make a request to the /content endpoint of the supplied backend exaclty once when it first renders", async () => {
        setResolveValues(mockFetch,[testContent])
        mockFetch.mockRejectedValueOnce(undefined)
        render(<Dashboard
            backend={new URL(config.backend)}
            filters={new Map<string,Set<string>>()}
            prefixes={prefixes}
        />)

        await screen.findByTestId("search-bar")
        expect(mockFetch).toHaveBeenCalled()
        expect(window.sessionStorage.getItem("")).toBe(JSON.stringify(["testContent"]))
    })

    it("Should send a request if a filter button is pressed", async () => {
        setResolveValues(mockFetch,[testContent],[testContent])
        mockFetch.mockRejectedValue(undefined)
        render(<Dashboard 
            backend={new URL(config.backend)}
            filters={filters}
            prefixes={prefixes}
        />);

        (await screen.findByText("test")).click()
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(2)
            expect(mockFetch).toHaveBeenLastCalledWith(`${config.backend}/content?allowedClasses=${encodeURIComponent(testContent)}`)
        })
    })
    it("Should update the displayed classes according to the latest set of selected filters", async () => {
        setResolveValues(mockFetch,[testContent],async () => {
            //Make the second request wait
            await new Promise<void>(resolve => {
                setTimeout(resolve,1000)
            })
            return [`${testContent}2`]
        },() => [`${testContent}3`],() => [`${testContent}4`])

        mockFetch.mockRejectedValueOnce(undefined)

        render(<Dashboard 
            backend={new URL(config.backend)}
            filters={filters}
            prefixes={prefixes}
        />);

        (await screen.findByText("test")).click()
        screen.getByText("test2").click()

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledTimes(4)
        })

        await expectSubjects("testContent3","testContent4")
    })
    afterEach(() => {
        mockFetch.mockReset()
        window.sessionStorage.clear()
    })
    afterAll(() => {
        global.fetch = saveFetch
    })
})