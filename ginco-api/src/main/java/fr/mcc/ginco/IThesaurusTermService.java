/**
 * Copyright or © or Copr. Ministère Français chargé de la Culture
 * et de la Communication (2013)
 * <p/>
 * contact.gincoculture_at_gouv.fr
 * <p/>
 * This software is a computer program whose purpose is to provide a thesaurus
 * management solution.
 * <p/>
 * This software is governed by the CeCILL license under French law and
 * abiding by the rules of distribution of free software. You can use,
 * modify and/ or redistribute the software under the terms of the CeCILL
 * license as circulated by CEA, CNRS and INRIA at the following URL
 * "http://www.cecill.info".
 * <p/>
 * As a counterpart to the access to the source code and rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty and the software's author, the holder of the
 * economic rights, and the successive licensors have only limited liability.
 * <p/>
 * In this respect, the user's attention is drawn to the risks associated
 * with loading, using, modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean that it is complicated to manipulate, and that also
 * therefore means that it is reserved for developers and experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systemsand/or
 * data to be ensured and, more generally, to use and operate it in the
 * same conditions as regards security.
 * <p/>
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 */
package fr.mcc.ginco;

import java.util.List;
import fr.mcc.ginco.beans.ThesaurusTerm;
import fr.mcc.ginco.exceptions.BusinessException;
import fr.mcc.ginco.beans.users.IUser;

/**
 * Service used to work with {@link ThesaurusTerm} objects, contains basic
 * methods exposed to client part. For example, to get a single
 * ThesaurusTerm object, use {@link #getThesaurusTermById(String)}
 *
 * @see fr.mcc.ginco.beans
 */
public interface IThesaurusTermService {
	
	/**
     * Get a single Thesaurus Term by its id
     *
     * @param id to search
     * @return {@code null} if not found
     */
	ThesaurusTerm getThesaurusTermById(String id) throws BusinessException;
	
    /**
     * Get list of paginated Thesaurus Terms.
     * @return List of Thesaurus Terms (the number given in argument), from the start index
     */
    List<ThesaurusTerm> getPaginatedThesaurusSandoxedTermsList(Integer startIndex, Integer limit, String idThesaurus);

    /**
     * Get number of Thesaurus Sandboxed Terms
     * @param Id of a Thesaurus
     * @return number of Thesaurus Sandboxed Terms for a given Thesaurus
     */
    Long getSandboxedTermsCount(String idThesaurus);
	
    /**
     * Create a single Thesaurus Term Object
     */
    ThesaurusTerm createThesaurusTerm(ThesaurusTerm object, IUser user);   
    
    /**
     * Update a single Thesaurus Term Object
     */
    ThesaurusTerm updateThesaurusTerm(ThesaurusTerm object, IUser user);
    
    /**
     * Delete a single Thesaurus Term Object
     */
    ThesaurusTerm destroyThesaurusTerm(ThesaurusTerm object, IUser user);
    
    /**
     * @param listOfTerms
     * @return
     * This method returns all the prefered terms
     */
    List<ThesaurusTerm> getPreferedTerms(List<ThesaurusTerm> listOfTerms);
    
}