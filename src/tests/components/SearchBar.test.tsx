import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import SearchBar from "../../components/SearchBar"

describe(SearchBar,() => {
    const testContent = "testContent"
    const invalidSearchChars = [..."*[]()^$?\\+{}!|"]
    it("Should trigger an overlay with all the subjects supplied through props when clicked on", async () => {
        const subjects = [`${testContent}1`, `${testContent}2`,`${testContent}3`]
        render(<SearchBar subjects={subjects}/>)
        screen.getByTestId("search-bar").click()
        await waitFor(() => {
            expect(screen.getByText(`${testContent}1`)).toBeInTheDocument()
        })
        expect(screen.getByText(`${testContent}2`)).toBeInTheDocument()
        expect(screen.getByText(`${testContent}3`)).toBeInTheDocument()
        const uris = screen.getAllByTestId("uri")
        for(const uri of uris){
            expect(uri.textContent).toMatch(new RegExp(`${testContent}[123]`))
        }
    })
    it("Should show the subjects that match the user's search", async () => {
        const subjects = ["zz","z","zzz","a","b"]
        render(<SearchBar subjects={subjects}/>)
        screen.getByTestId("search-bar").click()
        fireEvent.change(screen.getByTestId("search-bar"),{target: {value: "z"}})
        await waitFor(() => {
            expect(screen.getByText("z")).toBeInTheDocument()
        })
        expect(screen.getByText("zz")).toBeInTheDocument()
        expect(screen.getByText("zzz")).toBeInTheDocument()
        expect(screen.queryByText("a")).not.toBeInTheDocument()
        expect(screen.queryByText("b")).not.toBeInTheDocument()
    })
    it("Should order the search matches by where the match occurs in the string", async () => {
        const subjects = ["z", "yz", "xyz", "a", "b"]
        render(<SearchBar subjects={subjects}/>)
        fireEvent.change(screen.getByTestId("search-bar"),{target: {value: "z"}})
        screen.getByTestId("search-bar").click()
        await waitFor(() => {
            expect(screen.getByText("z")).toBeInTheDocument()
        })
        const list = screen.getByTestId("uri-list")
        expect(list.childElementCount).toBe(3)
        expect(list.childNodes[0].textContent).toBe("z")
        expect(list.childNodes[1].textContent).toBe("yz")
        expect(list.childNodes[2].textContent).toBe("xyz")
    })
    it("Should display an error message if no subjects are found that match the search parameters", async () => {
        const {rerender} = render(<SearchBar subjects={[]}/>)
        screen.getByTestId("search-bar").click()
        expect(await screen.findByText("no matches")).toBeInTheDocument()

        rerender(<SearchBar subjects={["a","b"]}/>)
        fireEvent.change(screen.getByTestId("search-bar"),{target: {value: "z"}})
        expect(await screen.findByText("no matches")).toBeInTheDocument()
    })
    it("Should escape special regex characters (e.g. '$' or '*')", async () => {
        render(<SearchBar subjects={invalidSearchChars}/>)
        screen.getByTestId("search-bar").click()
        await screen.findByText(invalidSearchChars[0])
        for(const chr of invalidSearchChars){
            fireEvent.change(screen.getByTestId("search-bar"),{target: {value: chr}})
            expect(screen.getByText(chr)).toBeInTheDocument()
        }
    })
})