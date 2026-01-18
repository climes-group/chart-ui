import A from "./A";
import Button from "./Button";

function Design() {
  return (
    <main className="p-8 min-h-100">
      <h1>Design system</h1>

      <section>
        <h2>Typography</h2>
      </section>
      <h2>Elements</h2>
      <section className="text-left">
        <h3>Links</h3>
        <div>
          This is a normal <A href="#">text link</A>
        </div>
        <h3>Buttons</h3>
        <div>
          <Button>Primary</Button>
        </div>
      </section>
    </main>
  );
}

export default Design;
