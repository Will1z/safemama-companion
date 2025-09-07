/**
 * Disallow multiple/non-element children when using asChild (Radix Slot).
 */
module.exports = {
  meta: { 
    type: "problem", 
    docs: { 
      description: "asChild must have exactly one element child" 
    } 
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const hasAsChild =
          node.attributes.some(a =>
            a.type === "JSXAttribute" &&
            a.name &&
            a.name.name === "asChild"
          );

        if (!hasAsChild) return;

        const parent = node.parent; // JSXElement
        if (!parent || !parent.children) return;
        const children = parent.children.filter(ch => ch.type !== "JSXText" || ch.value.trim() !== "");

        if (children.length !== 1 || children[0].type !== "JSXElement") {
          context.report({
            node: parent,
            message: "Components with asChild must have exactly one *element* child.",
          });
        }
      }
    };
  }
};
