﻿using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Web.UI;
public partial class Reports_RPT_AAOVarietyWiseSale : System.Web.UI.Page
{
    private UtilityLibrary utl = new UtilityLibrary();
    BLL_DropDown objUserBEL;
    DLL_DropDown objUserDLL;
    DataSet ds = new DataSet();
    string _connstrStock = ConfigurationManager.ConnectionStrings["SqlConStock"].ConnectionString;

    protected void Page_PreInit(object sender, EventArgs e)
    {

        if (Session["Name"] != null || Session["UserType"] != null)
        {
            if (this.Session["UserType"].ToString() == "AAOO")
            {
                this.Page.MasterPageFile = "../MasterPages/AAO.master";
                return;
            }
        }
        else
        {
            Response.Redirect("../Login.aspx");
        }
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        if (this.Session["UserID"] == null || this.Session["AuthToken"] == null || base.Request.Cookies["AuthToken"] == null)
        {
            this.utl.SessionReset();
        }
        else
        {
            if (!this.Session["AuthToken"].ToString().Equals(base.Request.Cookies["AuthToken"].Value))
            {
                this.utl.SessionReset();
                return;
            }
            if (!(this.Session["UserType"].ToString() == "AAOO") || !(this.Session["FirstLogin"].ToString() == "N"))
            {
                base.Response.Redirect("../Unauthorised.aspx", true);
                return;
            }
            if (!this.Page.IsPostBack)
            {
                btnExport.Enabled = false;
                FillCrop();
                FillScheme();
            }
        }
    }
    protected void FillCrop()
    {
        try
        {

            ds = new DataSet();
            ds = DsCrop();
            drpCropName.Items.Clear();
            if (ds != null)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    this.drpCropName.DataSource = ds;
                    this.drpCropName.DataValueField = "Crop_Code";
                    this.drpCropName.DataTextField = "Crop_Name";
                    this.drpCropName.DataBind();
                }
            }
            this.drpCropName.Items.Insert(0, "--- SELECT ---");

        }
        catch (ApplicationException applicationException1)
        {
            ApplicationException applicationException = applicationException1;
            System.Web.UI.ScriptManager.RegisterClientScriptBlock(this.Page, this.Page.GetType(), "asyncPostBack", string.Concat("alert('", applicationException.Message, "');"), true);
        }
        catch (Exception exception1)
        {
            Exception exception = exception1;
            System.Web.UI.ScriptManager.RegisterClientScriptBlock(this.Page, this.Page.GetType(), "asyncPostBack", "alert('Your request could not be completed due to exception. Please intimate technical team for rectification!');", true);
            ExceptionHandler.WriteLog(ExceptionHandler.CreateErrorMessage(exception));
        }
    }

    public DataSet DsCrop()
    {
        SqlConnection con = new SqlConnection(_connstrStock);

        SqlCommand cmd = new SqlCommand("SELECT Crop_Code,Crop_Name FROM mCrop WHERE is_active = 1 ORDER BY Crop_Name ASC", con);
        cmd.CommandType = CommandType.Text;
        try
        {
            SqlDataAdapter ada = new SqlDataAdapter(cmd);
            ds = new DataSet();
            ada.Fill(ds);
            return ds;
        }
        catch (Exception exception)
        {
            ExceptionHandler.WriteEx(exception);
            return null;
        }
        finally
        {
            cmd.Dispose();
            if (con.State != ConnectionState.Closed)
                con.Close();
            con.Dispose();
        }
    }
    private void FillScheme()
    {
        try
        {

            ds = new DataSet();
            ds = DsScheme();
            drpScheme.Items.Clear();
            if (ds != null)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    this.drpScheme.DataSource = ds;
                    this.drpScheme.DataValueField = "SCHEME_CODE";
                    this.drpScheme.DataTextField = "SCHEME_NAME";
                    this.drpScheme.DataBind();
                }
            }
            this.drpScheme.Items.Insert(0, "--- All ---");

        }
        catch (ApplicationException applicationException1)
        {
            ApplicationException applicationException = applicationException1;
            System.Web.UI.ScriptManager.RegisterClientScriptBlock(this.Page, this.Page.GetType(), "asyncPostBack", string.Concat("alert('", applicationException.Message, "');"), true);
        }
        catch (Exception exception1)
        {
            Exception exception = exception1;
            System.Web.UI.ScriptManager.RegisterClientScriptBlock(this.Page, this.Page.GetType(), "asyncPostBack", "alert('Your request could not be completed due to exception. Please intimate technical team for rectification!');", true);
            ExceptionHandler.WriteLog(ExceptionHandler.CreateErrorMessage(exception));
        }
    }
    private DataSet DsScheme()
    {
        SqlConnection con = new SqlConnection(_connstrStock);

        SqlCommand cmd = new SqlCommand("SELECT [SCHEME_CODE],[SCHEME_NAME] FROM [stock].[dbo].[mSCHEME] ORDER BY SCHEME_NAME ASC", con);
        cmd.CommandType = CommandType.Text;
        try
        {
            SqlDataAdapter ada = new SqlDataAdapter(cmd);
            ds = new DataSet();
            ada.Fill(ds);
            return ds;
        }
        catch (Exception exception)
        {
            ExceptionHandler.WriteEx(exception);
            return null;
        }
        finally
        {
            cmd.Dispose();
            if (con.State != ConnectionState.Closed)
                con.Close();
            con.Dispose();
        }
    }
    protected void btnSearch_Click(object sender, EventArgs e)
    {
        DataSet ds = new DataSet();

        string sql = "STOCK_RPT_aaoSaleVarietywise";
        string[] param = { "@Crop_Code", "@FIN_YR", "@Seassion", "@AAO_CODE", "@SCHEME_CODE", "@USER_TYPE", "@MONTH", "@FRMDT", "@TODT" };
        object[] value = { drpCropName.SelectedValue.Trim(), drpSession.SelectedValue.Trim(),drpSeassion.SelectedValue.Trim() == "0" ? System.Convert.DBNull
 : drpSeassion.SelectedValue.Trim(),Session["UserID"].ToString().Substring(4, 6).Trim(),drpScheme.SelectedValue.Trim()=="--- All ---"?System.Convert.DBNull:drpScheme.SelectedValue.Trim(),drpUser.SelectedValue.Trim()=="0"?System.Convert.DBNull:drpUser.SelectedValue.Trim(),drpMonth.SelectedValue.Trim()=="0" ?System.Convert.DBNull:drpMonth.SelectedValue.Trim(),txtfromdate.Text.Trim()==""?System.Convert.DBNull:txtfromdate.Text.Trim(),txtTodate.Text.Trim()==""?System.Convert.DBNull:txtTodate.Text.Trim() };
        ds = dbsAppStock.param_passing_fetchDataSetSP(sql, param, value);
        if (ds.Tables[1].Rows.Count > 0)
        {
            btnExport.Enabled = true;
            GenerateReport(ds);
        }
        else
        {
            btnExport.Enabled = false;
            litReport.Text = "<div style='background-color:Gray; color:White; font-size: 18px;'  class='tbltxt'  align='center'>No Records Found  !</div>";
        }
    }

    private void GenerateReport(DataSet ds)
    {

        StringBuilder str = new StringBuilder("");
        str.Append("<table style='width:100%; border-collapse:collapse; font-size: 14px; ' border='1' cellpadding='15' cellspacing='10' class='tbltxt'><tr style='background-color:#CCCCCC; font-weight:bold;'>");
        str.Append("<td>Dist Name  </td>");
        str.Append("<td style='text-align: Right; padding-right:5px;'>No. of farmer  </td>");
        str.Append("<td style='text-align: Right; padding-right:5px;'>Unregistered Farmer  </td>");
        DataView view = new DataView(ds.Tables[1]);
        view.Sort = "CROPCATG_ID ASC";
        DataTable dtVariety = view.ToTable(true, "CROP_VERID", "Variety_Name");
        foreach (DataRow dr in dtVariety.Rows)
        {
            str.Append(" <td style='text-align: Right; padding-right:5px;'>" + dr["Variety_Name"].ToString() + "</td>");
        }
        str.Append(" <td style='text-align: Right; padding-right:5px;'>Total</td>");
        str.Append("</tr>");
        foreach (DataRow dr in ds.Tables[0].Rows)
        {
            str.Append("<tr>");

            str.Append("<td align='left' class='tbltd'>");
          
            str.Append("" + dr["BLK_NAME"].ToString() + "</td>");


            DataRow[] NoofFarmer = ds.Tables[2].Select("BLOCK_ID= " + dr["BLK_CODE"].ToString() + "");
            if (NoofFarmer.Length > 0)
            {
                foreach (DataRow value in NoofFarmer)
                {
                    str.Append(" <td style='text-align: Right; padding-right:5px;'>" + value[1].ToString() + "</td>");
                }
            }
            else
            {
                str.Append(" <td style='text-align: Right; padding-right:5px;'>-- </td>");
            }

            DataRow[] uNoofFarmer = ds.Tables[3].Select("BLOCK_ID= " + dr["BLK_CODE"].ToString() + "");
            if (uNoofFarmer.Length > 0)
            {
                foreach (DataRow value in uNoofFarmer)
                {
                    str.Append(" <td style='text-align: Right; padding-right:5px;'>" + value[1].ToString() + "</td>");
                }
            }
            else
            {
                str.Append(" <td style='text-align: Right; padding-right:5px;'>-- </td>");
            }
            double TotSale = 0;
            foreach (DataRow drv in dtVariety.Rows)
            {
                DataRow[] Data = ds.Tables[1].Select("BLOCK_ID= " + dr["BLK_CODE"].ToString() + " AND CROP_VERID = '" + drv["CROP_VERID"].ToString() + "'");
                if (Data.Length > 0)
                {
                    foreach (DataRow value in Data)
                    {
                        str.Append(" <td style='text-align: Right; padding-right:5px;'>" + value[7].ToString() + "</td>");
                        TotSale = TotSale + double.Parse(value[7].ToString());
                    }
                }
                else
                {
                    str.Append(" <td style='text-align: Right; padding-right:5px;'>--</td>");
                }
            }
            str.Append(" <td style='text-align: Right; padding-right:5px;'>" + string.Format("{0:f2}", TotSale) + "</td>");
            str.Append("</tr>");
        }

        str.Append("<tr style='background-color:#CCCCCC; font-weight:bold; color:Red;'>");
        str.Append("<td>Grand Total</td>");
        str.Append("<td style='text-align: Right; padding-right:5px;' >" + ds.Tables[2].Compute("Sum(NoofFarmer)", "").ToString() + "</td>");
        str.Append("<td style='text-align: Right; padding-right:5px;' >" + ds.Tables[3].Compute("Sum(NoofFarmer)", "").ToString() + "</td>");
        foreach (DataRow dr in dtVariety.Rows)
        {
            str.Append("<td style='text-align: Right; padding-right:5px;'>" + string.Format("{0:f2}", double.Parse(ds.Tables[1].Compute("Sum(SALE)", "CROP_VERID='" + dr["CROP_VERID"].ToString() + "'").ToString())) + "</td>");
        }
        str.Append("<td style='text-align: Right; padding-right:5px;'>" + string.Format("{0:f2}", double.Parse(ds.Tables[1].Compute("Sum(SALE)", "").ToString())) + "</td>");
        str.Append("</tr>");
        str.Append("</table>");
        litReport.Text = str.ToString();
    }

    protected void btnToExcel_Click(object sender, EventArgs e)
    {
        try
        {
            string attachment = "attachment; filename=FarmerSaleList.xls";
            Response.ClearContent();
            Response.AddHeader("content-disposition", attachment);
            Response.ContentType = "application/ms-excel";
            StringWriter sWriter = new StringWriter();
            HtmlTextWriter htwWriter = new HtmlTextWriter(sWriter);
            litReport.RenderControl(htwWriter);
            Response.Write(sWriter.ToString());
            Response.End();
        }
        catch (Exception ex) { }
    }
}