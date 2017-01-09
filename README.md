# JSX BEMClasses [![Build Status][ci-img]][ci]

This babel plugin replace bem-attributes to className attribute with bem-entity object 

[ci-img]:  https://travis-ci.org/Silvestr-b/jsx-bemclasses.svg
[ci]:      https://travis-ci.org/Silvestr-b/jsx-bemclasses

### Block and Elem:
From:
```jsx
<button block="button">
	<span elem="text">clickme</span>
</button>
```
To:
```jsx
<button className={BEMClasses({block: "button"})}>
	<span className={BEMClasses({block: "button", elem: "text"})}>clickme</span>
</button>;
```
### Mods and mix:
From:
```jsx
<button 
	block="button" 
	mods={{size: "s"}} 
	mix={{block: 'form', elem: 'button'}}>
</button>
```
To:
```jsx
<button className={
	BEMClasses({
		block: "button", 
		mods: {size: "s"}, 
		mix: {block: 'form', elem: 'button'}
	})
}></button>;
```
### Find parent block in JSX
From:
```jsx
<button block="button">
	<span elem="inner">
		<span elem="icon"></span>
	</span>
</button>
```
To:
```jsx
<button className={BEMClasses({block: "button"})}>
	<span className={BEMClasses({block: "button", elem: "inner"})}>
		<span className={BEMClasses({block: "button", elem: "icon"})}></span>
	</span>
</button>;
```

## Usage

```js
const babel = require('babel-core');

babel.transform(yourCode, { plugins: ["syntax-jsx", "jsx-bemclasses"]}).code)

```

