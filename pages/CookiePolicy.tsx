import React from "react";

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-justify">
      <h1 className="text-3xl font-bold mb-6">Cookies Policy</h1>

      <div className="mb-8">
        <p className="mb-4">
          This Cookies Policy applies to the Digital Service linking to this
          Cookies Policy and forms part of the Privacy Notice, which describes
          our data handling practices and is available here. On the Digital
          Services, Women Spot (&apos;we&apos;, &apos;us&apos;, &apos;our&apos;
          or &apos;Women Spot&apos;) and third parties, including our
          advertising- and marketing-related service providers and partners, use
          a variety of technologies including cookies (&apos;Cookies and Similar
          Technologies&apos;).
        </p>
        <p className="mb-4">
          Cookies and Similar Technologies vary depending on the Digital
          Services and include cookies, web beacons, tags, scripts, pixels,
          local shared objects (including HTML5 cookies) and software
          development kits (&apos;SDKs&apos;). You can read more below about the
          types of cookies we use, why we use them and how you can exercise your
          choices regarding Cookies and Similar Technologies.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            WHAT ARE COOKIES AND SIMILAR TECHNOLOGIES?
          </h2>
          <p className="mb-4">
            The Digital Services automatically log certain information about
            visits to the Digital Services using Cookies and Similar
            Technologies, such as the number and frequency of visitors,
            technical information about browsers and devices used to access the
            Digital Services, and information about crashes or other technical
            issues. The Cookies and Similar Technologies which log this
            information are necessary to allow the Digital Services to function.
          </p>
          <p className="mb-4">
            We and third parties may automatically collect certain information
            through Cookies and Similar Technologies about your activities over
            time across the Digital Services as well as across third-party
            sites, apps or other media. Cookies and Similar Technologies may be
            included in our web pages, mobile apps, emails, and other digital
            content. They may assign or collect unique cookie IDs or other
            identifiers associated with your browser or device. They may collect
            information while you are using our Digital Services or while they
            are running in the background of your device.
          </p>
          <p className="mb-4">
            Cookies and Similar Technologies on the Digital Services may be
            served directly by Women Spot (referred to as &apos;first-party
            cookies&apos;) or by others such as advertisers and data analytics
            companies (referred to as &apos;third-party cookies&apos;).
          </p>
          <p>
            Cookies and Similar Technologies are browser- and device-specific
            and may endure for different periods of time. Some are deleted
            automatically once you close your browser or exit the Digital
            Service. These are sometimes referred to as &apos;session
            cookies&apos;. Other cookies are &apos;persistent cookies&apos;,
            meaning that they remain on your device after your browser is
            closed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            WHICH COOKIES DO WE USE AND WHY DO WE USE THEM?
          </h2>
          <p className="mb-4">
            Our Cookies Dashboard provides information on the different
            categories of Cookies and Similar Technologies that the Digital
            Services use, the companies that serve them and why we use them. The
            Cookies Dashboard is always available from our websites. If you have
            any questions about our use of Cookies and Similar Technologies
            please contact us using the details provided in the &apos;Contact
            Us&apos; section of our Privacy Notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            YOUR CHOICES, INCLUDING OPT-OUTS
          </h2>
          <p className="mb-4">
            Cookies and Similar Technologies help us, our service providers and
            business partners provide and customise the Digital Services. You
            have the right to choose whether or not to accept certain Cookies
            and Similar Technologies. However, if you choose to refuse or remove
            Cookies and Similar Technologies, this could affect the availability
            and functionality the Digital Services.
          </p>
          <p className="mb-6">
            Please use the Cookies Dashboard to adjust your preferences.
            Additionally, depending on how you access the Digital Services, you
            may exercise your choices through other channels as indicated below:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">
                Website (Browser) Opt-Out
              </h3>
              <p className="mb-3">
                Most browsers accept cookies by default. You may be able to
                change the settings to have your browser refuse certain Cookies
                and Similar Technologies or notify you before accepting cookies.
                To do so, please follow the instructions provided by your
                browser which are usually located within the &apos;Help&apos;,
                &apos;Tools&apos; or &apos;Edit&apos; facility.
              </p>
              <p className="mb-3">
                Some third parties also provide the ability to refuse their
                cookies directly by clicking on an opt-out link and you should
                review the cookies policy of the relevant third party to find
                out more about their cookies.
              </p>
              <p>
                You can also follow the instructions provided by the European
                Interactive Digital Advertising Alliance (&apos;EDAA&apos;) here
                to opt-out of Cookies from companies that have chosen to
                participate in the EDAA&apos;s opt-out scheme.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Mobile App Opt-Out</h3>
              <p className="mb-3">
                To limit tracking for advertising purposes on your mobile
                device, you can review and adjust the settings provided by your
                device manufacturer, such as &apos;Limit Ad Tracking&apos; for
                iOS or &apos;Opt-out of interest-based ads&apos; for Android.
              </p>
              <p>
                Please keep in mind that as the mobile environment continues to
                evolve, additional opt-out mechanisms or privacy settings may
                become available. We encourage you to review the information on
                opt-outs and settings that device manufacturers, technology
                companies and industry associations make available to you also.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">More Information</h3>
              <p>
                For further information about Cookies and Similar Technologies
                and how to exercise your choices, please visit
                <a
                  href="https://www.allaboutcookies.org"
                  className="text-blue-600 hover:underline ml-1"
                >
                  www.allaboutcookies.org
                </a>{" "}
                and
                <a
                  href="https://www.youronlinechoices.eu"
                  className="text-blue-600 hover:underline ml-1"
                >
                  www.youronlinechoices.eu
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;
