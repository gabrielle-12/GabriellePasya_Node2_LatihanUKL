const express = require('express')
const mysql = require('mysql')

const db = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: "sewa"
})

db.connect((err) => {
    if(err) throw err
    console.log('Database connected')
})

const createAdminTable = () => {
        let sql = `
            create table admin (
                id int unsigned auto_increment primary key,
                username varchar(100) not null,
                password varchar(255) not null,
                created_at timestamp default current_timestamp,
                updated_at timestamp default current_timestamp null on update current_timestamp
            )
        `
    
        db.query(sql, (err, result) => {
            if (err) throw err
    
            console.log('tabel admin sucsess')
        })
    }

const createUserTable = () => {
        let sql = `
            create table user (
                id int unsigned auto_increment primary key,
                username varchar(100) not null,
                password varchar(255) not null,
                created_at timestamp default current_timestamp,
                updated_at timestamp default current_timestamp null on update current_timestamp
            )
        `
    
        db.query(sql, (err, result) => {
            if (err) throw err
    
            console.log('tabel user sucsess')
        })
    }

const createMobilTable = () => {
        let sql = `
            create table mobil (
                id int unsigned auto_increment primary key,
                nama_mobil varchar(100) not null,
                tipe_mobil varchar(255) not null,
                stock varchar(255) not null,
                created_at timestamp default current_timestamp,
                updated_at timestamp default current_timestamp null on update current_timestamp
            )
        `
    
        db.query(sql, (err, result) => {
            if (err) throw err
    
            console.log('tabel mobil sucsess')
        })
    }

const createMotorTable = () => {
        let sql = `
            create table motor (
                id int unsigned auto_increment primary key,
                nama_motor varchar(100) not null,
                tipe_motor varchar(255) not null,
                stock varchar(255) not null,
                created_at timestamp default current_timestamp,
                updated_at timestamp default current_timestamp null on update current_timestamp
            )
        `
    
        db.query(sql, (err, result) => {
            if (err) throw err
    
            console.log('tabel motor sucsess')
        })
    }

    const createSepedaTable = () => {
        let sql = `
            create table sepeda (
                id int unsigned auto_increment primary key,
                nama_sepeda varchar(100) not null,
                tipe_sepeda varchar(255) not null,
                stock varchar(255) not null,
                created_at timestamp default current_timestamp,
                updated_at timestamp default current_timestamp null on update current_timestamp
            )
        `
    
        db.query(sql, (err, result) => {
            if (err) throw err
    
            console.log('tabel sepeda sucsess')
        })
    }

createAdminTable()
createUserTable()
createMobilTable()
createMotorTable()
createSepedaTable()