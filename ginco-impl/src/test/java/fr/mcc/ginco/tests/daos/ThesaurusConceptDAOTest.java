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
package fr.mcc.ginco.tests.daos;

import java.lang.reflect.Field;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.ReflectionUtils;

import fr.mcc.ginco.beans.Thesaurus;
import fr.mcc.ginco.beans.ThesaurusConcept;
import fr.mcc.ginco.dao.hibernate.ThesaurusConceptDAO;
import fr.mcc.ginco.exceptions.BusinessException;
import fr.mcc.ginco.log.Log;
import fr.mcc.ginco.tests.BaseDAOTest;

public class ThesaurusConceptDAOTest extends BaseDAOTest {	
	
	private ThesaurusConceptDAO thesaurusConceptDAO = new ThesaurusConceptDAO();

	@Before
	public void handleSetUpOperation() throws Exception {
		super.handleSetUpOperation();
		thesaurusConceptDAO.setSessionFactory(getSessionFactory());
		ReflectionUtils.doWithFields(thesaurusConceptDAO.getClass(),
				new ReflectionUtils.FieldCallback() {

					public void doWith(Field field)
							throws IllegalArgumentException,
							IllegalAccessException {
						ReflectionUtils.makeAccessible(field);

						if (field.getAnnotation(Log.class) != null) {
							Logger logger = LoggerFactory
									.getLogger(thesaurusConceptDAO.getClass());
							field.set(thesaurusConceptDAO, logger);
						}
					}
				});

	}

	@Test
	public void testGetOrphansThesaurusConcept() throws BusinessException {
		String thesaurusId = "http://www.culturecommunication.gouv.fr/th1";
		Thesaurus th = new Thesaurus();
		th.setIdentifier(thesaurusId);
		List<ThesaurusConcept> actualConcepts = thesaurusConceptDAO
				.getOrphansThesaurusConcept(th);
		Assert.assertEquals(2,actualConcepts.size());
	}

    @Test
    public void testGetThesaurusFromConcept() throws BusinessException {
        String thesaurusConceptId = "http://www.culturecommunication.gouv.fr/co1";
        ThesaurusConcept thesaurusConcept = thesaurusConceptDAO.getById(thesaurusConceptId);
        String expectedThesaurusTitle = "test";
        Assert.assertEquals("Parent thesaurus is not as expected !", thesaurusConcept.getThesaurus().getTitle(),
                expectedThesaurusTitle);
    }
	

	@Override
	public String getXmlDataFileInit() {
		return "/thesaurusconcept_init.xml";
	}
}
