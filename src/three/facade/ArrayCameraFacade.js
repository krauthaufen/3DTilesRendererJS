import { Matrix4 } from 'three';

// Helpers to accept simple float-array based camera descriptors.
// A descriptor is an object with numeric arrays (length 16) for
// projectionMatrix, matrixWorldInverse and/or matrixWorld.

export function isArrayCamera( camera ) {
    if ( ! camera ) return false;
    const p = camera.projectionMatrix;
    if ( ! p ) return false;
    if ( Array.isArray( p ) ) return p.length === 16;
    if ( ArrayBuffer.isView && ArrayBuffer.isView( p ) ) return p.length === 16;
    if ( p && typeof p.length === 'number' && p.length === 16 && typeof p[ 0 ] === 'number' ) return true;
    return false;
}

export function matrix4FromAny( v ) {
    if ( ! v ) return null;
    // If it's already a Matrix4-like object (has elements array)
    if ( v.elements && v.elements.length === 16 ) {
        const m = new Matrix4();
        for ( let i = 0; i < 16; i ++ ) m.elements[ i ] = v.elements[ i ];
        return m;
    }
    // If it's an array-like (Float32Array etc)
    if ( Array.isArray( v ) || ( v && typeof v.length === 'number' && v.length === 16 ) ) {
        const m = new Matrix4();
        for ( let i = 0; i < 16; i ++ ) m.elements[ i ] = v[ i ];
        return m;
    }
    return null;
}

export function getCameraMatrices( camera ) {
    return {
        projectionMatrix: matrix4FromAny( camera.projectionMatrix ),
        matrixWorldInverse: matrix4FromAny( camera.matrixWorldInverse ),
        matrixWorld: matrix4FromAny( camera.matrixWorld ),
    };
}
