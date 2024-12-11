import type { AnyFn } from './types'
import { isEmpty, isInt, isNumber } from '@lincy/utils'

export interface RulesType {
    required?: boolean
    type?: string
    pattern?: RegExp
    message?: string
    trigger?: string[] | string
    validator?: (rule: RulesType, value: any, callback: AnyFn) => void
}

type CityType = Record<number, string>

function isNumberWithPrecision(str: string | number, precision?: number) {
    if (typeof str === 'number')
        str = String(str)

    // 检查是否为有效的数字字符串（包括正负号、整数部分和小数部分）
    // eslint-disable-next-line regexp/no-unused-capturing-group
    const numberRegex = /^-?\d+(\.\d+)?$/

    if (!numberRegex.test(str))
        return false // 如果不是有效的数字格式，则返回false

    // 检查是否有小数点，并且小数点后的位数不超过指定的precision
    if (precision) {
        const decimalPart = str.split('.')[1]
        if (decimalPart && decimalPart.length > precision)
            return false
    }

    // 如果通过了上面的所有检查，那么这个字符串就是一个合法的数字
    return true
}

class Rules {
    /**
     * 字符串类型, 即一般文本框
     * @param text 字段名
     * @param maxLength 最大长度
     * @param minLength 最小长度
     * @param trigger 动作: change, blur
     * @param required 是否能为空
     * @returns Rules
     */
    string(text: string, maxLength?: number, minLength?: number, trigger: string[] | string = ['change', 'blur'], required: boolean = true) {
        const rules: RulesType[] = [
            {
                required,
                type: 'string',
                message: `请输入${text}`,
                trigger,
            },
        ]
        if (isInt(maxLength) || isInt(minLength)) {
            rules.push({
                required,
                validator: (_rule, value, callback) => {
                    if (!required && isEmpty(value))
                        return callback()

                    if (maxLength && isInt(maxLength) && value.length > maxLength)
                        return callback(new Error(`${text}长度不能大于${maxLength}`))

                    if (minLength && isInt(minLength) && value.length < minLength)
                        return callback(new Error(`${text}长度不能小于${minLength}`))

                    callback()
                },
                trigger,
            })
        }
        return rules
    }

    /**
     * 只允许字母或数字
     * @param text 字段名
     * @param maxLength 最大长度
     * @param minLength 最小长度
     * @param trigger 动作: change, blur
     * @param required 是否能为空
     * @returns Rules
     */
    letter_number(text: string, maxLength?: number, minLength?: number, trigger: string[] | string = ['change', 'blur'], required: boolean = true) {
        const rules: RulesType[] = [
            {
                required,
                message: `请输入${text}`,
                trigger,
            },
        ]

        if (isInt(maxLength) || isInt(minLength)) {
            rules.push({
                required,
                validator: (_rule, value, callback) => {
                    if (!required && isEmpty(value))
                        return callback()

                    const preg = /^[0-9a-z]*$/i
                    if (!preg.test(value))
                        return callback(new Error(`${text}只能是字母或数字`))

                    if (maxLength && isInt(maxLength) && value.length > maxLength)
                        return callback(new Error(`${text}长度不能大于${maxLength}`))

                    if (minLength && isInt(minLength) && value.length < minLength)
                        return callback(new Error(`${text}长度不能小于${minLength}`))

                    callback()
                },
                trigger,
            })
        }

        return rules
    }

    /**
     * 选择类型, 如 单选框, 复选框, 下拉框 之类的
     * @param text 字段名
     * @param multiple 是否为数组 @default false
     * @returns Rules
     */
    select(text: string, multiple: boolean = false) {
        const rules: RulesType = {
            required: true,
            message: `请选择${text}`,
            trigger: 'change',
        }
        if (multiple)
            rules.type = 'array'

        return [rules]
    }

    /**
     * Url网址
     * @param text 字段名
     * @param required 是否能为空
     * @returns Rules
     */
    url(text: string, required = true) {
        const rules: RulesType[] = [
            {
                required,
                message: `${text}格式不正确`,
                type: 'url',
                trigger: 'blur',
            },
        ]
        return rules
    }

    /**
     * 整数(包含0, 负整数), 通过正则匹配, 可限制最大值最小值
     * @param text 字段名
     * @param maximum 最大值
     * @param minimum 最小值
     * @param trigger 动作: change, blur
     * @param required 是否能为空
     * @returns Rules
     */
    integer(text: string, maximum?: number, minimum?: number, trigger: string[] | string = ['change', 'blur'], required = true) {
        const rules: RulesType[] = []
        rules.push({
            required,
            validator: (_rule, value, callback) => {
                if (!required && isEmpty(value))
                    return callback()

                if (required && isEmpty(value))
                    return callback(new Error(`${text}不能为空`))

                if (typeof value === 'number') {
                    if (!isInt(value)) {
                        return callback(new Error(`${text}只能是整数`))
                    }
                }
                else {
                    const preg = /^-?\d+$/
                    if (!preg.test(value))
                        return callback(new Error(`${text}只能是整数`))
                }

                callback()
            },
            trigger,
        })
        if (isInt(maximum) || isInt(minimum)) {
            rules.push({
                required,
                validator: (_rule, value, callback) => {
                    if (!required && isEmpty(value))
                        return callback()

                    if (maximum && isInt(maximum) && Number(value) > maximum)
                        return callback(new Error(`${text}不能大于${maximum}`))

                    if (minimum && isInt(minimum) && Number(value) < minimum)
                        return callback(new Error(`${text}不能小于${minimum}`))

                    callback()
                },
                trigger,
            })
        }
        return rules
    }

    /**
     * 整数或者浮点数(包含0和负数), 通过正则匹配, 可限制最大值最小值
     * @param text 字段名
     * @param precision 小数点位数
     * @param maximum 最大值
     * @param minimum 最小值
     * @param trigger 动作: change, blur
     * @param required 是否能为空
     * @returns Rules
     */
    integer_float(text: string, precision?: number, maximum?: number, minimum?: number, trigger: string[] | string = ['change', 'blur'], required = true) {
        const rules: RulesType[] = []
        rules.push({
            required,
            validator: (_rule, value, callback) => {
                if (!required && isEmpty(value))
                    return callback()

                if (required && isEmpty(value))
                    return callback(new Error(`${text}不能为空`))

                if (!isNumberWithPrecision(value, precision))
                    return callback(new Error(`${text}只能是整数或者小数${precision ? `(小数后${precision}位)` : ''}`))

                callback()
            },
            trigger,
        })
        if (isInt(maximum) || isInt(minimum)) {
            rules.push({
                required,
                validator: (_rule, value, callback) => {
                    if (!required && isEmpty(value))
                        return callback()

                    if (maximum && isInt(maximum) && Number(value) > maximum)
                        return callback(new Error(`${text}不能大于${maximum}`))

                    if (minimum && isInt(minimum) && Number(value) < minimum)
                        return callback(new Error(`${text}不能小于${minimum}`))

                    callback()
                },
                trigger,
            })
        }
        return rules
    }

    /**
     * 金额类型, 通过正则验证, 支持小数点后两位, 且可以限制最大值和最小值
     * @param text 字段名
     * @param maximum 最大值
     * @param minimum 最小值
     * @param trigger 动作: change, blur
     * @param required 是否能为空
     * @returns Rules
     */
    money(text: string, maximum?: number, minimum?: number, trigger: string[] | string = ['change', 'blur'], required = true) {
        text = text || '金额'
        const rules: RulesType[] = []
        rules.push({
            required,
            validator: (_rule, value, callback) => {
                if (!required && isEmpty(value))
                    return callback()

                if (required && isEmpty(value))
                    return callback(new Error(`${text}不能为空`))

                // eslint-disable-next-line regexp/no-unused-capturing-group
                const preg = /^((0)|([1-9]\d*)|([1-9]\d*)(\.\d{1,2})|(0\.0[1-9])|(0\.[1-9]\d?))$/
                if (!preg.test(value))
                    return callback(new Error(`${text}只能是数字和小数点后面两位`))

                callback()
            },
            trigger,
        })
        if ((maximum && isNumber(maximum)) || (minimum && isNumber(minimum))) {
            rules.push({
                required,
                validator: (_rule, value, callback) => {
                    if (!required && isEmpty(value))
                        return callback()

                    if (isNumber(maximum) && Number(value) > maximum)
                        return callback(new Error(`${text}不能大于${maximum}`))

                    if (isNumber(minimum) && Number(value) < minimum)
                        return callback(new Error(`${text}不能小于${minimum}`))

                    callback()
                },
                trigger,
            })
        }
        return rules
    }

    /**
     * 国内通用手机号码
     * @param text 字段名
     * @param required 是否能为空
     * @returns Rules
     */
    phone(text: string, required = true) {
        const rules: RulesType[] = [
            {
                required,
                message: `请输入${text}`,
                trigger: 'blur',
            },
            {
                type: 'string',
                pattern: /^1[3-9]\d{9}$/,
                message: `${text}格式不正确`,
                trigger: 'blur',
            },
        ]
        return rules
    }

    /**
     * 国内通用银行卡
     * @param text 字段名
     * @param required 是否能为空
     * @returns Rules
     */
    bank_card(text: string, required = true) {
        const rules: RulesType[] = [
            {
                required,
                message: `请输入${text}`,
                trigger: 'blur',
            },
            {
                type: 'string',
                pattern: /^(\d{16}|\d{19})$/,
                message: `${text}格式不正确`,
                trigger: 'blur',
            },
        ]
        return rules
    }

    /**
     * 邮箱验证
     * @param text 字段名
     * @param required 是否能为空
     * @returns Rules
     */
    email(text: string, required = true) {
        const rules: RulesType[] = [
            {
                required,
                message: `${text}不能为空`,
                trigger: 'blur',
            },
            {
                type: 'string',
                pattern: /^([\w.-])+@(([a-z0-9-])+\.)+[a-z0-9]{2,4}$/i,
                message: `${text}格式不正确`,
                trigger: 'blur',
            },
        ]
        return rules
    }

    /**
     * QQ号
     * @param text 字段名
     * @param required 是否能为空
     * @returns Rules
     */
    qq(text: string, required = true) {
        const rules: RulesType[] = [
            {
                required,
                message: `${text}不能为空`,
                trigger: 'blur',
            },
            {
                type: 'string',
                pattern: /^[1-9]\d{4,10}$/,
                message: `${text}格式不正确`,
                trigger: 'blur',
            },
        ]
        return rules
    }

    /**
     * 身份证号码验证
     * @param text 字段名
     * @param required 是否能为空
     * @returns Rules
     */
    idcard(text: string, required = true) {
        text = text || '身份证号码'
        const rules: RulesType[] = []
        rules.push({
            required,
            validator: (_rule, value, callback) => {
                if (!required && isEmpty(value))
                    return callback()

                if (required && isEmpty(value))
                    return callback(new Error(`${text}不能为空`))

                const city: CityType = {
                    11: '北京',
                    12: '天津',
                    13: '河北',
                    14: '山西',
                    15: '内蒙古',
                    21: '辽宁',
                    22: '吉林',
                    23: '黑龙江 ',
                    31: '上海',
                    32: '江苏',
                    33: '浙江',
                    34: '安徽',
                    35: '福建',
                    36: '江西',
                    37: '山东',
                    41: '河南',
                    42: '湖北 ',
                    43: '湖南',
                    44: '广东',
                    45: '广西',
                    46: '海南',
                    50: '重庆',
                    51: '四川',
                    52: '贵州',
                    53: '云南',
                    54: '西藏 ',
                    61: '陕西',
                    62: '甘肃',
                    63: '青海',
                    64: '宁夏',
                    65: '新疆',
                    71: '台湾',
                    81: '香港',
                    82: '澳门',
                    91: '国外 ',
                }
                let tip = ''
                const twoStr: number = value.substr(0, 2) as number as keyof CityType
                // eslint-disable-next-line regexp/no-unused-capturing-group
                if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
                    tip = '格式错误'
                }
                else if (!city[twoStr]) {
                    tip = '地址编码错误'
                }
                else {
                    // 18位身份证需要验证最后一位校验位
                    if (value.length === 18) {
                        const arr_value = value.split('')
                        // ∑(ai×Wi)(mod 11)
                        // 加权因子
                        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
                        // 校验位
                        const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
                        let sum = 0
                        let ai = 0
                        let wi = 0
                        for (let i = 0; i < 17; i++) {
                            ai = arr_value[i]
                            wi = factor[i]
                            sum += ai * wi
                        }
                        if (parity[sum % 11] !== arr_value[17])
                            tip = '校验位错误'
                    }
                }
                if (tip)
                    return callback(new Error(text + tip))

                callback()
            },
            trigger: 'blur',
        })
        return rules
    }
}
export default new Rules()
