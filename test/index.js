'use strict'

const expect = require('chai').expect;
const sinon = require('sinon');
const babel = require('babel-core');
const plugin = require('../index');


describe('', () => {

	describe('Должен заменять БЭМ-аттрибуты на аттрибут className со значением в виде вызова функции BEMClasses с аргументом в виде объекта описания БЭМ-сущности:', () => {
		
		it('если указан только блок', () => {
		    run(p().singleBlock)
		})

		it('если указан блок и элемент', () => {
		    run(p().blockWithElem)
		})
		
		it('если указан блок и модификаторы', () => {
			run(p().blockWithMods)
		})

		it('если указан блок и миксы', () => {
			run(p().blockWithMix)
		})
		
		it('если у элемента не указан блок, и блок существует выше на один уровень по дереву', () => {
			run(p().blockForElemUpOneLevel)
		})

		it('если у элемента не указан блок, и блок существует выше на несколько уровней по дереву', () => {
			run(p().blockForElemUpManyLevels)
		})

		it('если значение атрибута block - строка', () => {
			run(p().blockIsString)
		})

		it('если значение атрибута block - JSX-выражение', () => {
			run(p().blockIsJSX)
		})

		it('если значение атрибута elem - строка', () => {
			run(p().elemIsString)
		})

		it('если значение атрибута elem - JSX-выражение', () => {
			run(p().elemIsJSX)
		})

	})

	describe('Должен бросать исключение:', () => {

		it('если у элемента не указан блок, и блок НЕ существует выше по дереву', () => {
			expect(() => { run(p().elemWithoutUpBlock) }).to.throw(Error)
		})
		
	})

	describe('Должен игнорировать:', () => {

		it('если не указан блок или элемент', () => {
			run(p().withoutBlockAndElem)
		})
		
	})

})

function p(){
	return {
		singleBlock: {
			input: '<button block="button"></button>',
			output: '<button className={BEMClasses({block: "button"})}></button>;'
		},
		blockWithElem: {
			input: '<button block="button" elem="icon"></button>',
			output: '<button className={BEMClasses({block: "button", elem: "icon"})}></button>;'
		},
		blockWithMods: {
			input: '<button block="button" mods={{size: "s"}}></button>',
			output: '<button className={BEMClasses({block: "button", mods: {size: "s"}})}></button>;'
		},
		blockWithMix: {
			input: '<button block="button" mix={[{block: "form", elem: "button"}]}></button>',
			output: '<button className={BEMClasses({block: "button", mix: [{block: "form", elem: "button"}]})}></button>;'
		},
		blockForElemUpOneLevel: {
			input: '<button block="button"><span elem="icon"></span></button>',
			output: '<button className={BEMClasses({block: "button"})}><span className={BEMClasses({block: "button", elem: "icon"})}></span></button>;'
		},
		blockForElemUpManyLevels: {
			input: `
				<button block="button">
					<span elem="inner">
						<span elem="icon"></span>
					</span>
				</button>
			`,
			output: `
				<button className={BEMClasses({block: "button"})}>
					<span className={BEMClasses({block: "button", elem: "inner"})}>
						<span className={BEMClasses({block: "button", elem: "icon"})}></span>
					</span>
				</button>;
			`
		},
		blockIsString: {
			input: '<button block="button"></button>',
			output: '<button className={BEMClasses({block: "button"})}></button>;'
		},
		blockIsJSX: {
			input: '<button block={this.name}></button>',
			output: '<button className={BEMClasses({block: this.name})}></button>;'
		},
		elemIsString: {
			input: '<button block="button" elem="icon"></button>',
			output: '<button className={BEMClasses({block: "button", elem: "icon"})}></button>;'
		},
		elemIsJSX: {
			input: '<button block="button" elem={this.elems.icon}></button>',
			output: '<button className={BEMClasses({block: "button", elem: this.elems.icon})}></button>;'
		},
		elemWithoutUpBlock: {
			input: '<button><span elem="icon"></span></button>',
			output: ''
		},
		withoutBlockAndElem: {
			input: '<button mods={{size: "s"}}><span mix={[{block: "form"}]}></span></button>',
			output: '<button><span></span></button>;'
		}
	}
}



function toFormat(code){
	return code.replace(/[\s\t\n]+/gi, '')
}

function run(obj) {
    return expect(toFormat(babel.transform(obj.input, { plugins: ["syntax-jsx", plugin], comments: false }).code)).to.equal(toFormat(obj.output));
}
