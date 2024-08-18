import { pbkdf2 } from 'crypto';

export const hash = (password: string, salt: string) => new Promise<string>((resolve, reject) => {
    pbkdf2(password, salt, 1000, 64, 'sha512', (err, key) => {
        if (err) reject(err)
        else resolve(key.toString('hex'))
    })
})

export const validate = (password: string, salt: string, hash: string) => new Promise<boolean>((resolve, reject) => {
    pbkdf2(password, salt, 1000, 64, 'sha512', (err, key) => {
        if (err) reject(err)
        else resolve(hash === key.toString('hex'))
    })
})
