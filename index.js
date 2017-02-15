'use strict'

const BEMAttrs = new Set(['block', 'elem', 'mods', 'mix']);

module.exports = function ({ types: t }) {
  return {
    visitor: {
      	JSXAttribute: {
        	enter: (path) => {
              if(path.node.name.name === 'block' || path.node.name.name === 'elem'){
                const attr = path;
                path = path.parentPath.parentPath;

                const isElem = hasAttribute(path, 'elem');
				
                const obj = {
                  block: isElem? getAttribute(path, 'block') || getParentName(path) : getAttribute(path, 'block'),
                  elem: isElem? getAttribute(path, 'elem') : null,
                  mods: getAttribute(path, 'mods'),
                  mix: getAttribute(path, 'mix')
                }

                const insert = t.jSXAttribute(
                  t.JSXIdentifier('className'), 
                  t.jSXExpressionContainer(
                    t.callExpression(
                      t.identifier('BEMClasses'), 
                      [
                        t.objectExpression([
                            t.objectProperty(t.identifier('block'), obj.block.expression || t.stringLiteral(obj.block.value)),
                            obj.elem && t.objectProperty(t.identifier('elem'), obj.elem.expression || t.stringLiteral(obj.elem.value)),
                            obj.mods && t.objectProperty(t.identifier('mods'), obj.mods.expression || obj.mods.value),
                            obj.mix && t.objectProperty(t.identifier('mix'), obj.mix.expression || obj.mix.value)
                        ].filter(a=>a))
                      ]
                    )
                  )                 
                )

                hasAttribute(path, 'className') || attr.insertBefore(insert)              

              }
          }
        },
      	JSXOpeningElement: {
          exit: (path) => {
            path.traverse({
            	JSXAttribute(path){
                  if(BEMAttrs.has(path.node.name.name)){
                      path.remove();
                  }
                }
            })
          }
        }
      }
  }
}

function hasAttribute(path, name){
	return path.node.openingElement.attributes.some(attr => attr.name.name === name);
}

function getAttribute(path, name){
  	const attr = path.node.openingElement.attributes.filter(attr => attr.name.name === name)[0];
	return attr? attr.value : null
}

function getParentName(path){
  	let current = path.parentPath;

	while(current.node.type !== 'ExpressionStatement'){
      	if(current.node.type === 'JSXElement' && current.node.openingElement.attributes.some(attr => attr.name.name === 'block')){
        	return current.node.openingElement.attributes.filter(attr => attr.name.name === 'block')[0].value
        }
    	current = current.parentPath;
    }
   
  	return current
}