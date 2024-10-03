const express = require('express')
const app = express()
app.listen(3000, console.log('Server ON'))


  
  // importamos la función

  const {obtenerJoyas, obtenerJoyasPorFiltros, prepararHATEOAS, reportarConsulta} = require('./consultas')

  

  app.get("/joyas", async (req, res) => {
    try {
      const queryStrings = req.query;
    const inventario = await obtenerJoyas(queryStrings);
    const HATEOAS = await prepararHATEOAS(inventario)
    res.json(HATEOAS);
      
    } catch (error) {
      res.status(500).send(error)
    }
    
    });

    app.get('/joyas/filtros', async (req, res) => {
      try {
        const queryStrings = req.query
        const inventario = await obtenerJoyasPorFiltros(queryStrings)
        res.json(inventario)
        } catch (error) {
          res.status(500).send(error)
        }
        });

        app.get("*", (req, res) => {
            res.status(404).send("Esta ruta no existe")
            })

            app.get("/joyas/:id", reportarConsulta, async (req, res) => {
              try {
              const { id } = req.params
              const joyas = await obtenerJoyas(id)
              res.json(joyas)
              } catch (error) {
                res.status(500).send(error)
                }
              })
              