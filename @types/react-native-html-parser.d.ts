declare module "react-native-html-parser" {
    export class DOMParser {
        constructor()
        parseFromString(source: string, mimeType: string): Document
    }
}

export class Document extends Element {
    nodeName: '#document';
    nodeType: DOCUMENT_NODE;
    doctype: null;
    documentElement: null;

    insertBefore(newChild, refChild);
    removeChild(oldChild);
    importNode(importedNode, deep);
    getElementById(id: string): Element;
    getElementByClassName(className): Element;
    getElementByAttribute(attribute, selector, undefine): Element;
    createElement(tagName);
    createDocumentFragment();
    createTextNode(data);
    createComment(data);
    createCDATASection(data);
    createProcessingInstruction(target, data);
    createAttribute(name: string);
    createEntityReference(name: string);
    createElementNS(namespaceURI, qualifiedName);
    createAttributeNS(namespaceURI, qualifiedName)
};

export class Element {
    textContent: string
    nodeType: ELEMENT_NODE;
    hasAttribute(name: string): boolean;
    getAttribute(name: string): string;
    getAttributeNode(name: string);
    setAttribute(name: string, value: string);
    removeAttribute(name: string);
    appendChild(newChild);
    setAttributeNode(newAttr);
    setAttributeNodeNS(newAttr);
    removeAttributeNode(oldAttr);
    removeAttributeNS(namespaceURI, localName);
    hasAttributeNS(namespaceURI, localName);
    getAttributeNS(namespaceURI, localName);
    setAttributeNS(namespaceURI, qualifiedName, value: string);
    getAttributeNodeNS(namespaceURI, localName);
    getElementsByTagName(tagName): Element[];
    getElementsByClassName(className, exactMatch = true): Element[];
    getElementsByTagNameNS(namespaceURI, localName): Element[];
    getElementsByAttribute(attribute, selector, undefine): Element[];
    getElementsBySelector(selector): Element[];
    querySelect(querys)
}