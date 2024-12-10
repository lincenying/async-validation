import type { Rules } from 'async-validator'

import asyncValidator from 'async-validator'
import { interopImportCJSDefault } from 'node-cjs-interop'
import { expect, it } from 'vitest'
import rules from './'

const Schema = interopImportCJSDefault(asyncValidator)

const descriptor = {
    name1: rules.string('姓名1', 12, 6),
    name2: rules.string('姓名2', 3, 1),
    age: rules.integer('年龄', 99, 1),
    pass1: rules.letter_number('密码1', 16, 8),
    pass2: rules.letter_number('密码2', 16, 8),
    select1: rules.select('select1', true),
    select2: rules.select('select2', false),
    url1: rules.url('url1'),
    url2: rules.url('url2'),
    integer1: rules.integer('integer1'),
    integer2: rules.integer('integer2'),
    integer3: rules.integer('integer3'),
    integer_float1: rules.integer_float('integer_float1', 3),
    integer_float2: rules.integer_float('integer_float2', 3),
    integer_float3: rules.integer_float('integer_float3', 3),
    money1: rules.money('money1'),
    money2: rules.money('money2'),
    money3: rules.money('money3'),
    phone1: rules.phone('phone1'),
    phone2: rules.phone('phone2'),
    email1: rules.email('email1'),
    email2: rules.email('email2'),
    qq1: rules.qq('qq1'),
    qq2: rules.qq('qq2'),
    idcard1: rules.idcard('idcard1'),
    idcard2: rules.idcard('idcard2'),

} as Rules

const validator = new Schema(descriptor)

it('checkRules', async () => {
    const promiseFunc = () => new Promise((resolve) => {
        validator
            .validate({
                name1: 'muji',
                name2: 'muji',
                age: 16,
                pass1: '1234abcd',
                pass2: '1232#3232a',
                select1: '1',
                select2: '1',
                url1: 'https://github.com/',
                url2: 'github.com',
                integer1: '123',
                integer2: 0,
                integer3: -4,
                integer_float1: '123',
                integer_float2: 0.1222,
                integer_float3: -4.333,
                money1: '123',
                money2: 0.12,
                money3: -4.333,
                phone1: '13333333333',
                phone2: '1333333333',
                email1: '1333333333@qq.com',
                email2: '1333333333@qq',
                qq1: '1333333',
                qq2: '13333qq',
                idcard1: '152201198511080048',
                idcard2: '152201198511080041',
            })
            .then(() => {
                resolve('ok')
            })
            .catch(({ _errors, fields }) => {
                const arr: string[] = []
                Object.keys(fields).forEach((item) => {
                    arr.push(fields[item][0].message)
                })
                resolve(arr)
            })
    })
    const checkVal = await promiseFunc()
    expect(checkVal).toMatchInlineSnapshot(`
      [
        "姓名1长度不能小于6",
        "姓名2长度不能大于3",
        "密码2只能是字母或数字",
        "请选择select1",
        "url2格式不正确",
        "integer_float2只能是整数或者小数(小数后3位)",
        "money3只能是数字和小数点后面两位",
        "phone2格式不正确",
        "email2格式不正确",
        "qq2格式不正确",
        "idcard1校验位错误",
        "idcard2校验位错误",
      ]
    `)
})
