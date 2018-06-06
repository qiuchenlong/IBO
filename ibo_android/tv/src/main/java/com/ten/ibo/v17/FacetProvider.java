package com.ten.ibo.v17;


public interface FacetProvider {

    /**
     * Queries optional implemented facet.
     * @param facetClass  Facet classes to query,  examples are: class of
     *                    {@link ItemAlignmentFacet}.
     * @return Facet implementation for the facetClass or null if feature not implemented.
     */
    public Object getFacet(Class<?> facetClass);

}
