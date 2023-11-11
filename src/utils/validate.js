/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 定义校验手机号的校验函数
export function validMobile(mobile) {
  return /^1[3-9]\d{9}$/.test(mobile)
}

// 生成一个必填项的校验规则函数
/**
 *
 * @param {string} message 错误时的提示信息
 * @param {string} trigger 触发方式
 * @returns
 */
export function createRequiredRule(message, trigger = 'blur') {
  return {
    required: true, message, trigger
  }
}

/**
 *
 * @param {RegExp} reg  正则规则
 * @param {string} message 错误提示信息
 * @param {string} trigger 触发方式
 * @returns
 */

export function createPatternRule(reg, message, trigger = 'blur') {
  return {
    pattern: reg,
    message,
    trigger
  }
}
