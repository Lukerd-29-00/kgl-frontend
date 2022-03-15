import Joi from "joi"
export default interface Config{
    backend: URL,
    prefixes: Map<string,string>,
    filters: Map<string,Set<string>>
}

export const configSchema = Joi.object({
    backend: Joi.string().uri().required(),
    prefixes: Joi.object().pattern(Joi.string().required(), Joi.string().uri().required()),
    filters: Joi.object().pattern(Joi.string().required(), Joi.array().items(Joi.alternatives(Joi.string().uri().required(),Joi.string().regex(/^[^:]*:.+$/).required())).unique())
})