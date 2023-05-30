const sequelize = require('../db')
const ApiError = require('../error/apiError')
const { OrderGo } = require('../models/models')

class OrderController {
    async getOrder (req, res, next) {
        try {
            const getData = await OrderGo.findAll({ order: sequelize.literal('id_order DESC')})
            return res.send(getData)
        } catch (error) {
            return next(ApiError.badRequest('Что-то пошло не так :('))
        }
    }
    
    async postOrder (req, res, next) {
        try {
            const { fio, number, order } = req.body
            if(!fio || !number) {
                return next(ApiError.badRequest('Некоторые данные были введены неккоректно'))
            } else {
                await OrderGo.create({fio, number, order})
                return res.json({ message: "Заказ успешно отправлен" })
            }
        } catch (error) {
            return next(ApiError.badRequest('Что-то пошло не так :('))
        }
    }

    async updatePhoned (req, res, next) {
        try {
            const { id_order } = req.body
            if(!id_order) {
                return next(ApiError.badRequest('Некоторые данные были введены неккоректно'))
            } else {
                const checkOrder = await OrderGo.findOne({ where: {id_order}})
                if(checkOrder.phoned) {
                    return next(ApiError.badRequest('Клиента уже обзвонили'))
                } else {
                    await OrderGo.update({phoned: true}, {where: {id_order}})
                    return res.json({ message: 'Успешно'})
                }
            }
        } catch (error) {
            return next(ApiError.badRequest('Что-то пошло не так :('))
        }
    }
}

module.exports = new OrderController()