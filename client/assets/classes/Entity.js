/* =========================================================================
 *
 * Entity.js
 *  Definition of our "Entity". Abstractly, an entity is basically an ID.
 *  Here we implement an entity as a container of data (container of components)
 *
 * ========================================================================= */
export class Entity{

    constructor(components) {
        // Generate a pseudo random ID
        this.id = (+new Date()).toString(16) +
            (Math.random() * 100000000 | 0).toString(16);

        // The component data will live in this object
        this.components = {};
        if (components) {
            for (let component of components) {
                this.addComponent(component);
            }
        }
    }

    addComponent(component){
        // Add component data to the entity
        this.components[component.name] = component;
    };

    print () {
        // Function to print / log information about the entity
        console.log(JSON.stringify(this, null, 4));
    };
}