export class ComponentStore {
    constructor(ComponentStoreChangeTracker){
        this.components = new Map();

        this.ComponentStoreChangeTracker = ComponentStoreChangeTracker;

        this.logger = function(entityID, componentName, ComponentStoreChangeTracker) {
            return {
                set(obj, key, val) {

                    if (obj[key] !== val){
                        ComponentStoreChangeTracker.addChangeToComponent(componentName, entityID, key, val);
                        obj[key] = val;
                    }

                    return true;
                }
            }
        }
    }

    checkComponentByEntityId(component, entityID){
        return this.components.get(component).has(entityID);
    }

    deleteComponentByEntityId(component, entityID){
        this.ComponentStoreChangeTracker.deleteComponent(component, entityID);
        return this.components.get(component).delete(entityID);
    }

    getComponentsByComponentType(component){
        return this.components.get(component) || new Map();
    }

    getComponentByEntityId(component, entityID){
        if (this.checkComponentByEntityId(component, entityID)){
            return this.components.get(component).get(entityID);
        } else {
            return false;
        }
    }

    setComponentByEntityId(component, entityID, entityComponent){
        this.components.get(component).set(entityID, entityComponent);
    }

    deleteEntity(entityID){
        for (let componentName of this.components.keys()){
            this.deleteComponentByEntityId(componentName, entityID);
        }
    }

    addEntity(entity){
        for (let component of entity.components){

            if (!this.components.has(component.name)){
                this.components.set(component.name, new Map());
            }

            this.setComponentByEntityId(component.name, entity.id, new Proxy(component, new this.logger(entity.id, component.name, this.ComponentStoreChangeTracker)));
            this.ComponentStoreChangeTracker.addComponentCreation(component, entity.id);
        }
    }
}