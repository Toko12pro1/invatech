import React from "react";
import { supabase } from "../../lib/supabaseClient";

const STATUSES = ["pending", "paid", "used"];

export default class AdminVouchers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { vouchers: [], loading: true, error: "" };
    this.updateStatus = this.updateStatus.bind(this);
  }

  componentDidMount() {
    this.loadVouchers();
  }

  async loadVouchers() {
    this.setState({ loading: true });
    const { data, error } = await supabase
      .from("wifi_vouchers")
      .select("id, code, status, buyer_contact, created_at, wifi_packages(data_amount, data_unit, duration_days, price)")
      .order("created_at", { ascending: false });
    if (error) {
      this.setState({ loading: false, error: error.message });
      return;
    }
    this.setState({ vouchers: data, loading: false });
  }

  async updateStatus(voucher, status) {
    const { error } = await supabase.from("wifi_vouchers").update({ status }).eq("id", voucher.id);
    if (error) {
      this.setState({ error: error.message });
      return;
    }
    this.loadVouchers();
  }

  render() {
    const { vouchers, loading, error } = this.state;

    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>WiFi Vouchers</h1>
        </div>
        <p className="admin-page-hint">
          Every generated voucher is a unique, permanent record — a code can never be issued twice.
          Mark a voucher <strong>paid</strong> once you've confirmed Mobile Money payment, and{" "}
          <strong>used</strong> once it's been activated on the router.
        </p>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p>Loading…</p>
        ) : vouchers.length === 0 ? (
          <p>No vouchers generated yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Created</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher.id}>
                    <td className="admin-table-code">{voucher.code}</td>
                    <td>
                      {voucher.wifi_packages
                        ? `${voucher.wifi_packages.data_amount} ${voucher.wifi_packages.data_unit} / ${voucher.wifi_packages.duration_days}d`
                        : "—"}
                    </td>
                    <td>
                      {voucher.wifi_packages
                        ? new Intl.NumberFormat("en-US").format(voucher.wifi_packages.price) + " FCFA"
                        : "—"}
                    </td>
                    <td>{new Date(voucher.created_at).toLocaleString()}</td>
                    <td>
                      <select
                        value={voucher.status}
                        onChange={(event) => this.updateStatus(voucher, event.target.value)}
                        className={`admin-status admin-status--${voucher.status}`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}
