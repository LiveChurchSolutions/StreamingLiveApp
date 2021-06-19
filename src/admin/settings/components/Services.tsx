import React from "react";
import { DisplayBox, ServiceEdit, AdminServiceInterface, ApiHelper, UserHelper } from ".";
import { DateHelper } from "../../../helpers";

export const Services: React.FC = () => {
  const [services, setServices] = React.useState<AdminServiceInterface[]>([]);
  const [currentService, setCurrentService] = React.useState<AdminServiceInterface>(null);

  const handleUpdated = () => { setCurrentService(null); loadData(); }
  const getEditContent = () => <a href="about:blank" onClick={handleAdd}><i className="fas fa-plus"></i></a>
  const loadData = () => {
    ApiHelper.get("/services", "StreamingLiveApi").then(data => {
      data.forEach((s: AdminServiceInterface) => {
        s.serviceTime = new Date(Date.parse(s.serviceTime.toString()));
        s.serviceTime.setMinutes(s.serviceTime.getMinutes() + s.timezoneOffset);
      })
      setServices(data);
    });
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();

    let tz = new Date().getTimezoneOffset();
    let defaultDate = getNextSunday();
    //defaultDate.setTime(defaultDate.getTime() + (9 * 60 * 60 * 1000) - (tz * 60 * 1000));
    defaultDate.setTime(defaultDate.getTime() + (9 * 60 * 60 * 1000));

    let link: AdminServiceInterface = { churchId: UserHelper.currentChurch.id, serviceTime: defaultDate, chatBefore: 600, chatAfter: 600, duration: 3600, earlyStart: 600, provider: "youtube_live", providerKey: "", recurring: false, timezoneOffset: tz, videoUrl: "", label: "Service Name" }
    setCurrentService(link);
    loadData();
  }

  const getNextSunday = () => {
    let result = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    while (result.getDay() !== 0) result.setDate(result.getDate() + 1);
    return result;
  }

  const getRows = () => {
    //var idx = 0;
    let rows: JSX.Element[] = [];
    services.forEach(service => {
      rows.push(
        <tr key={service.id}>
          <td>{service.label}</td>
          <td>{DateHelper.prettyDateTime(service.serviceTime)}</td>
          <td className="text-right">
            <a href="about:blank" onClick={(e: React.MouseEvent) => { e.preventDefault(); setCurrentService(service); }}><i className="fas fa-pencil-alt"></i></a>
          </td>
        </tr>
      );
      //idx++;
    })
    return rows;
  }

  React.useEffect(() => { loadData(); }, []);

  if (currentService !== null) return <ServiceEdit currentService={currentService} updatedFunction={handleUpdated} />;
  else return (
    <DisplayBox headerIcon="far fa-calendar-alt" headerText="Services" editContent={getEditContent()} id="servicesBox">
      <table className="table table-sm">
        <tbody>
          {getRows()}
        </tbody>
      </table>
    </DisplayBox>

  );

}
