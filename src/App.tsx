import "react-app-polyfill/ie11"
import "react-app-polyfill/ie9"
import "react-app-polyfill/stable"
import React from "react"
import "./App.css"
import Dashboard from "./components/Dashboard"
import Joi from "joi"

const configSchema = Joi.object({
    backend: Joi.string().uri().required(),
    prefixes: Joi.object().pattern(Joi.string().required(), Joi.string().uri().required()),
    filters: Joi.object().pattern(Joi.string().required(), Joi.array().items(Joi.alternatives(Joi.string().uri().required(),Joi.string().regex(/^[^:]*:.+$/).required())).unique())
})

interface AppProps{
    config: unknown
}

interface RawJs{
    filters: Map<string,string[]>,
    backend: string,
    prefixes: Map<string,string>
}

function App(props: AppProps) {
    const {error} = configSchema.validate(props.config)
    if(error !== undefined){
        throw Error(error.message)
    }
    const config = props.config as RawJs
    const filters = new Map<string,Set<string>>()
    for(const entry of Object.entries(config.filters)){
        filters.set(entry[0],new Set(entry[1]))
    }

    return <Dashboard backend={new URL(config.backend)} prefixes={config.prefixes} filters={filters}/>
}

export default App
