const { restore } = require('../../../models/Board');

module.exports = async function(req,res)
{
    const {Thread} = require('../../../models');
    
    try
    {
        const threadResults = await Thread.findByPk(
        {
             where: { id: req.params.id }
        });

        res.status(200).json(threadResults);
    } catch (error) {
        res.status(500).json({"error":error});
    }
}