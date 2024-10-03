const { Pool } = require("pg");
const format = require('pg-format');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "1979",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});

// Agregamos la función obtenerJoyas
const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC",
    page = 1}) => {
    const [campo, direccion] = order_by.split("_")
    const offset = (page - 1) * limits
    const formattedQuery = format('SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s', campo, direccion, limits, offset);
    pool.query(formattedQuery);
    const { rows: inventario } = await pool.query(formattedQuery)
    return inventario
    }

    const obtenerJoyasPorFiltros = async ({ precio_max, precio_min, stock_min, categoria, metal }) => {
        let filtros = []
        const values = []
        const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
        }
        if (precio_max) agregarFiltro('precio', '<=', precio_max)
        if (precio_min) agregarFiltro('precio', '>=', precio_min)
        if (stock_min) agregarFiltro('stock', '>=', stock_min)
        if  (categoria) agregarFiltro('precio', '=', categoria)
        if  (metal) agregarFiltro('metal', '=', metal)
        let consulta = "SELECT * FROM inventario"
        if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta += ` WHERE ${filtros}`
        }
        const { rows: joyas } = await pool.query(consulta, values)
        return joyas
        }

        const prepararHATEOAS = (joyas) => {
            const results = joyas.map((m) => {
            return {
            name: m.nombre,
            href: `/joyas/joya/${m.id}`,
            }
            }).slice(0, 4)
            const total = joyas.length
            const HATEOAS = {
            total,
            results
            }
            return HATEOAS
            }

            const reportarConsulta = async (req, res, next) => {
                const parametros = req.params
                const url = req.url
                console.log(`
                Hoy ${new Date()}
                Se ha recibido una consulta en la ruta ${url}
                con los parámetros:
                `, parametros)
                next()
                }
                
            

    // Exportamos la función
    module.exports = {obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS, reportarConsulta}