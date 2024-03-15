export interface ObservationInterface {
  resourceType: string;
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
  };
  text: {
    status: string;
    div: string;
  };
  status: string;
  category: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
    text: string;
  }[];
  code: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
    text: string;
  };
  subject: {
    reference: string;
  };
  encounter: {
    reference: string;
  };
  effectiveDateTime: string;
  issued: string;
  performer: {
    reference: string;
    display: string;
  }[];
  hasMember: {
    reference: string;
  }[];
}
