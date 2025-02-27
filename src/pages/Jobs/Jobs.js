import { t, Trans } from "@lingui/macro";
import Card from "components/Common/Card";
import SEO from "components/Common/SEO";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { getPageTitle } from "lib/legacy";
import "./Jobs.css";

function Jobs() {
  return (
    <SEO title={getPageTitle("Job Openings")}>
      <div className="default-container page-layout Referrals">
        <div className="section-title-block">
          <div className="section-title-icon" />
          <div className="section-title-content">
            <div className="Page-title">
              <Trans>Jobs</Trans>
            </div>
            <div className="Page-description">
              <Trans>Job openings at Axion.</Trans>
            </div>
          </div>
        </div>
        <div className="jobs-page-body">
          <NoJob />
        </div>
      </div>
    </SEO>
  );
}

function NoJob() {
  return (
    <Card title={t`No open positions at AXION currently`}>
      <div className="body-para">
        <p className="subheading">
          <Trans>
            Axion is not actively looking for new hires at the moment. However, if you think you can contribute to the
            project, please email <ExternalLink href="mailto:jobs@axion.io">jobs@axion.io</ExternalLink>.
          </Trans>
        </p>
      </div>
    </Card>
  );
}

// function JobCard() {
//   return (
// <Card title="Senior front-end developer (Full-time position)">
//   <div className="body-para">
//     <p className="subheading">What you will do:</p>
//     <ul>
//       <li>Work closely with the Axion team on the Axion front-end website.</li>
//       <li>Collaborate and discuss features to be worked on.</li>
//       <li>Remote full-time position, flexible working hours.</li>
//     </ul>
//     <div className="mt-lg">
//       <p className="subheading">What we are looking for:</p>
//       <ul>
//         <li>Required skills: HTML5, CSS3, React, Ethers, Web3 JS.</li>
//         <li>Bonus skills: Node JS.</li>
//         <li>5+ years of experience.</li>
//         <li>Previous DeFi experience and knowledge.</li>
//         <li>Must speak fluent English and available to start right away.</li>
//         <li>Comfortable making changes to the interface following our current design guidelines.</li>
//       </ul>
//       <p>The salary is 60,000 to 120,000 USD + 1,000 to 3,000 AXION a year.</p>
//       <p className="jobs-contact">
//         If the job suits you, please get in touch with{" "}
//         <a target="_blank" href="mailto:jobs@axion.io" rel="noopener noreferrer">
//           jobs@axion.io
//         </a>{" "}
//         using the following email subject: Application for Senior front-end developer: [Your name]
//       </p>
//     </div>
//   </div>
// </Card>
//   );
// }

export default Jobs;
