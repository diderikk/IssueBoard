module Mutations
	class Edit::EditIssueLabel < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "EditIssueLabel"
		argument :attributes, Types::Input::IssueLabelInputType, required: true
		argument :issue_label_id, ID, required: true, loads: IssueLabel

		field :issue_label, Types::IssueLabelType, null: true
		field :errors, [String], null: true

		def resolve(attributes:, issue_label:)
			(raise GraphQL::ExecutionError.new "No group with that id") if issue_label.nil?

			if issue_label.update(name: attributes.name, color: attributes.color)
				{
					issue_label: issue_label,
					errors: nil,
				}
			else
				{
					issue_label: nil,
					errors: issue_label.errors.full_messages,
				}
			end
		end

		def load_issue_label(id)
			IssueLabel.find(id)
		end

		private

		def authorized?(attributes:,  issue_label:)
			issue_label_authorized?(issue_label, nil, context);
		end
	end
end