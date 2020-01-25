export class ComponentStore {
    constructor(){
        this.components = new Map();
    }

    checkComponentByEntityId(component, entityID){
        return this.components.get(component).has(entityID);
    }

    deleteComponentByEntityId(component, entityID){
        return this.components.get(component).delete(entityID);
    }

    getComponentsByComponentType(component){
        return this.components.get(component) || new Map();
    }

    getComponentByEntityId(component, entityID){
        return this.components.get(component).get(entityID);
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
            //
            if (!this.components.has(component.name)){
                this.components.set(component.name, new Map());
            }

            this.setComponentByEntityId(component.name, entity.id, component);
        }
    }
}