import { Request, Response } from "express";
import { UserModel } from "../models/UsersModel";

export const registerUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        //Primero validar que los datos que necesitamos existen!
        const name = req.body.name
        const email = req.body.email
        const lastNames = req.body.lastNames
        const password = req.body.password
        const rol = req.body.rol

        //Administradores NO PUEDEN crear clientes
        if (req.user?.rol === "administrator" && rol === "client") {
            res.status(400).json({ msg: "Los administradores no pueden crear clientes" })
            return
        }
        if (!name || !email || !lastNames || !password || !rol) {
            res.status(400).json({
                msg: "Faltan datos para crear un usuario"
            })
            return
        }
        //Validar que el usuario sea administrador si el usuario a crear es admnistrador
        if (rol === "administrator" && req.user?.rol != "administrator") {
            res.status(400).json({
                msg: "No puedes crear un nuevo administrador si no eres uno"
            })
            return
        }
        await UserModel.create({
            name,
            lastNames,
            email,
            password,
            rol
        })

        res.status(200).json({ msg: "Usuario registrado con exito!" })
        return
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Hubo un error al crear el usuario" })
        return
    }
}