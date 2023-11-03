export function executeCode(
    args: Array<{
        name: string,
        value: any
    }>, 
    code: string,
    returns: boolean = true
) {
    let name_array = [], value_array = []
    
    for(let {name, value} of args) {
        name_array.push(name)
        value_array.push(value)
    }
    
    if(returns)
        new Function(...name_array, `(async () => {${code}})();`)(...value_array);
    else
        return new Function(...name_array, `${code}`)(...value_array);
}

function executeOnStartup(scripts: Array<string>) {}
function setupExecutionBlock(block_id: string) {}