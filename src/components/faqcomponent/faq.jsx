import React, { useEffect, useState } from "react";
import faqQuestion from "./faq.json";
import "./faq.css";
import faqbanner from "../../assets/images/faqbanner.svg";
import search from "../../assets/images/search.svg";
import flag from "../../assets/images/flag.svg";
import pricing from "../../assets/images/pricing.svg";
import guide from "../../assets/images/guide.svg";
import Highlighter from "react-highlight-words";
import Synonyms from "synonyms";
import useConstant from "use-constant"
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';

const useDebouncedSearch = (searchFunction) => {
  const [searchText, setSearchText] = useState('');
  const [searchRelatedWords, setSearchReleatedWords] = useState([]);

  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );
  const results = useAsync(
    async () => {
      return debouncedSearchFunction(searchText);
    },
    [debouncedSearchFunction, searchText]
  );
  return {
    searchText,
    setSearchText,
    results,
    searchRelatedWords,
    setSearchReleatedWords
  };
};

const FaqComponent = () => {
  const [helpType, setHelpType] = useState("Pricing & Plans");
  const [faqQuestions, setFaqQuestions] = useState(faqQuestion.gettingStarted);
  const searchRef = React.createRef();

  const searchFunction = async (searchText) => {
    if (searchText && searchText.length > 0) {
      var relatedwords = [searchText];
      try {
        const resp = await Synonyms(searchText);
        if (resp) {
          if (resp.v)
            resp.v.forEach((word) => word.length > 1 && relatedwords.push(word));
          if (resp.n)
            resp.n.forEach((word) => word.length > 1 && relatedwords.push(word));
        }
      } catch (err) { console.log(err) }
      setSearchReleatedWords([...new Set(relatedwords)]);
    } else setSearchReleatedWords([]);
  }
  const useSearch = () => useDebouncedSearch(searchFunction);
  const { searchText, setSearchText, searchRelatedWords, setSearchReleatedWords } = useSearch();

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  const handleHelpType = (e, value) => {
    setHelpType(value);
    const elements = document.getElementsByClassName("collapse");
    for (var i = 0; i < elements.length; i++)
      elements?.[i]?.classList?.remove?.("show")
    const elements1 = document.getElementsByClassName("accor-header");
    for (var i = 0; i < elements1.length; i++)
      elements1[i].ariaExpanded = false
  };

  useEffect(() => {
    if (helpType === "Getting Started") {
      setFaqQuestions(faqQuestion.gettingStarted);
    }
    else if (helpType === "Pricing & Plans") {
      setFaqQuestions(faqQuestion.pricingAndPlans);
    }
    else {
      setFaqQuestions(faqQuestion.dataProtectionAndPrivacy);
    }
  }, [helpType])

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchRef.current?.scrollIntoView?.();
  }

  return (
    <div className="faq-wrapper">
      {/* banner */}
      <div className="faq-banner">
        <div className="faq-banner-left">
          <h5>Have any Questions?</h5>
          <p>Here are some common responses that might be helpful.</p>
          <div className="input-icon">
            <img src={search} alt="search" />
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                name="search"
                placeholder="Search"
                onChange={handleChange}
              />
            </form>
          </div>
        </div>
        <div className="faq-banner-right">
          <img src={faqbanner} alt="" />
        </div>
      </div>
      {/* choose */}
      <div className="c-container choose-container" ref={searchRef}>
        <h5>Choose the kind of help you need</h5>
        <div className="choose-help">
          {/* use active class when user click on this */}
          <div
            className={`choose-help-card ${helpType === "Getting Started"
              ? "active"
              : ""
              }`}
            onClick={(e) => handleHelpType(e, "Getting Started")}
          >
            <img src={flag} alt="flag" />
            <h6>Getting Started</h6>
          </div>
          <div
            className={`choose-help-card ${helpType === "Pricing & Plans"
              ? "active"
              : ""
              }`}
            onClick={(e) => handleHelpType(e, "Pricing & Plans")}
          >
            <img src={pricing} alt="flag" />
            <h6>Pricing & Plans</h6>
          </div>
          <div
            className={`choose-help-card ${helpType === "Data Privacy"
              ? "active"
              : ""
              }`}
            onClick={(e) => handleHelpType(e, "Data Privacy")}
          >
            <img src={guide} alt="flag" />
            <h6>Data Privacy</h6>
          </div>
        </div>
        {/* accordion */}
        <div className="choose-accordion">
          {faqQuestions &&
            faqQuestions[0].map((question, index) => {
              return (
                <div className="choose-accordion-card">
                  <div
                    className="accor-header"
                    data-toggle="collapse"
                    href={`#accor${index}`}
                    role="button"
                    aria-controls={`accor${index}`}
                  >
                    <h4>
                      <Highlighter
                        highlightClassName="highlight"
                        searchWords={searchRelatedWords}
                        autoEscape={true}
                        textToHighlight={question.question}
                      />
                    </h4>
                    <span className="span"></span>
                  </div>
                  <div className="accor-body collapse" id={`accor${index}`}>
                    {/* <p>{question.answer}</p> */}
                    <p dangerouslySetInnerHTML={{ __html: question.answer }} />
                  </div>
                </div>
              );
            })}
        </div>
        {/* can't find  */}
        <div className="cant-find">
          <h6>Can’t find what you are looking for?</h6>
          <p>
            Please leave a message with your query and contact details at
            <span>
              <a href="mailto: contact@extramile.in">contact@extramile.in</a>
            </span>
            . We shall get back to you within 24 hours.
          </p>
          <p>Until then, keep PLAYing!</p>
        </div>
      </div>
    </div>
  );
};

export default FaqComponent;
