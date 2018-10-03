describe('example', ()=> {
  const name: string = 'Anna';
  it('works', () => {
    expect('Hello, Anna').toBe(`Hello, ${name}`);
  });
});
