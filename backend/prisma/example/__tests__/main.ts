describe('example', ()=> {
	const name: string = 'Anna';
	it('works', () => {
		expect('Hello, Anna').toBe(`Hello, ${name}`);
	});
	it('math', () => {
		expect(1 + 1).toBe(2)
	})
});
