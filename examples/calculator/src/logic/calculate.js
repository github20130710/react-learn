import Big from "big.js";
import operate from "./operate";
import isNumber from "./isNumber";

/**
 * Given a button name and a calculator data object, return an updated
 * calculator data object.
 *
 * Calculator data object contains:
 *   total:String      the running total
 *   next:String       the next number to be operated on with the total
 *   operation:String  +, -, etc.
 */
export default function calculate(obj, buttonName) {
    console.log(obj);
    
    // clear
    if (buttonName === "AC") {
        return {
          total: null,
          next: null,
          operation: null,
        };
    }

    // type the number
    if (isNumber(buttonName)) {
        if(buttonName === "0" && obj.next === "0") {
            return {};
        }
        if(obj.operation) {
            if(obj.next) {
                return { next: obj.next + buttonName };
            }
            return { next: buttonName };
        }
        if(obj.next){
            return {
                next: obj.next + buttonName,
                total: null
            }
        }
        return {
            next: buttonName,
            total: null
        }
    }

    // User pressed an operation button and there is an existing operation
    if(obj.operation) {
        return  {
            total: operate(obj.total, obj.next, obj.operation),
            next: null,
            operation: buttonName
        }
    }

    // before type any number, save the opreation
    if(!obj.next){
        return {operation: buttonName};
    } 

    // type the operation
    if(buttonName === "%"){
        if(obj.operation && obj.next) {
            const result = operate(obj.total, obj.next, obj.operation);
            return {
                total: Big(result).div(Big("100")).toString(),
                next: null,
                operation: null,
            };
        }
        if (obj.next) {
            return {
              next: Big(obj.next).div(Big("100")).toString(),
            };
        }
        return {};
    }

    if (buttonName === ".") {
        if (obj.next) {
          // ignore a . if the next number already has one
          if (obj.next.includes(".")) {
            return {};
          }
          return { next: obj.next + "." };
        }
        return { next: "0." };
    }
    
    if (buttonName === "=") {
        if (obj.next && obj.operation) {
          return {
            total: operate(obj.total, obj.next, obj.operation),
            next: null,
            operation: null,
          };
        } else {
          // '=' with no operation, nothing to do
          return {};
        }
    }
    
    if (buttonName === "+/-") {
        if (obj.next) {
          return { next: (-1 * parseFloat(obj.next)).toString() };
        }
        if (obj.total) {
          return { total: (-1 * parseFloat(obj.total)).toString() };
        }
        return {};
    }

    // save the operation and shift 'next' into 'total'
    return {
        total: obj.next,
        next: null,
        operation: buttonName,
    };
}